// check is speech API is supported
try {
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    var recognition = new SpeechRecognition();
    $('.no-browser-support').hide()
} catch (e) {
    console.error(e);
    $('.no-browser-support').show();
    $('.start-record-btn').hide();
}

var noteTextarea = $('#inputText');
var targetDiv = $("#outputText");
var instructions = $('#recording-instructions');
var minlength = 0;
var searchRequest = null;

var noteContent = '';


// to keep the recording on for about 15 seconds
recognition.continuous = true;

// called every time the Speech APi captures a line.
recognition.onresult = function(event) {

    // hold all the lines we have captured so far.
    var current = event.resultIndex;

    // Get a transcript of what was said.
    var transcript = event.results[current][0].transcript;

    // solve the bug of text repeating twice on phone
    var mobileRepeatBug = (current == 1 && transcript == event.results[0][0].transcript);
    if (!mobileRepeatBug) {
        noteContent += transcript;
        noteTextarea.val(noteContent);
        if (noteContent.length >= minlength) {
            if (searchRequest != null)
                searchRequest.abort();
            searchRequest = $.ajax({
                type: "POST",
                url: 'trans_result.php',
                data: {
                    input1: noteTextarea.val()
                },
                complete: function(data) {
                    targetDiv.html('');
                    targetDiv.append(data.responseText);
                }
            });
        }
    }
};

recognition.onstart = function() {
    instructions.text('Voice recognition activated. Try speaking into the microphone.');
}

recognition.onspeechend = function() {
    instructions.text('You were quiet for a while so voice recognition turned itself off.');
    recognition.stop();
}

$('#start-record-btn').on('click', function(e) {
    if (noteContent.length) {
        noteContent += ' ';
    }
    recognition.start();
});

recognition.onerror = function(event) {
    if (event.error == 'no-speech') {
        instructions.text('No speech was detected. Try again.');
    };
}

// Sync the text inside the text area with the noteContent variable.
noteTextarea.on('input', function() {
    noteContent = $(this).val();
})