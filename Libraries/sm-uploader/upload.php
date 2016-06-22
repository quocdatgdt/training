<?php
	if (file_exists("upload/" . $_FILES["file-upload"]["name"])){
		// $_FILES["file"]["name"] . " already exists. ";	 
	}
    else{
		move_uploaded_file($_FILES["file-upload"]["tmp_name"],"upload/" . $_FILES["file-upload"]["name"]);    
	}
    
	$arr = array("Upload"=>$_FILES["file-upload"]["name"], 
				 "Type"=>$_FILES["file-upload"]["type"],
				 "Size"=>($_FILES["file-upload"]["size"] / 1024),
				 "Temp_file"=>$_FILES["file-upload"]["tmp_name"],
				 "path"=>"upload/" . $_FILES["file-upload"]["name"]
				 );
		echo json_encode($arr);
	exit;
	
	if ((($_FILES["file-upload"]["type"] == "image/gif")
	|| ($_FILES["file-upload"]["type"] == "image/jpeg")
	|| ($_FILES["file-upload"]["type"] == "image/pjpeg"))
	&& ($_FILES["file-upload"]["size"] < 20000)){
		if ($_FILES["file-upload"]["error"] > 0){
			echo "Return Code: " . $_FILES["file-upload"]["error"] . "<br />";
		}
		else{
			// echo "Upload: " . $_FILES["file"]["name"] . "<br />";
			// echo "Type: " . $_FILES["file"]["type"] . "<br />";
			// echo "Size: " . ($_FILES["file"]["size"] / 1024) . " Kb<br />";
			// echo "Temp file: " . $_FILES["file"]["tmp_name"] . "<br />";

			if (file_exists("upload/" . $_FILES["file-upload"]["name"])){
				echo $_FILES["file-upload"]["name"] . " already exists. ";	
			}
			else{
				// move_uploaded_file($_FILES["file"]["tmp_name"],
				// "upload/" . $_FILES["file"]["name"]);
				// echo "Stored in: " . "upload/" . $_FILES["file"]["name"];
				
				$arr = array("Upload"=>$_FILES["file-upload"]["name"], 
						 "Type"=>$_FILES["file-upload"]["type"],
						 "Size"=>($_FILES["file-upload"]["size"] / 1024),
						 "Temp_file"=>$_FILES["file-upload"]["tmp_name"],
						 "path"=>"upload/" . $_FILES["file-upload"]["name"]
						 );
				echo json_encode($arr);		
			}
				
			exit;
		}
	}
	else{
		echo "Invalid file";
	}
?> 