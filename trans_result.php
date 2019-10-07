<?php
        $result = "";	
	$Content = $_POST['input1'];
	$ereg='/\n/';
        $arr_str = preg_split($ereg,$Content);
	foreach($arr_str as $value){
		$result = ` echo $value | nc 127.0.0.1 8181`;
		echo $result.'<br>';
	}       
?>
