<html>

<head>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>

</head>

<body>


<a href="http://tinyurl.com/asssssd">http://tinyurl.com/asssssd</a>
<div class="result"></div>

<script type="text/javascript">

function getURLtoDeRedirect(inputURL) {
	$.get('http://localhost/random2.php?url=' + inputURL, function(data) {
		// alert(data);
		
		pos = data.indexOf(' class="black" href="');		// Length: 21
		pos2 = data.indexOf('">If not then please click this link</a>');	// Marks the end of what we want.
		newURL = data.substring(pos + 21, pos2 - 1);

		// alert(" Start: " + pos + "\n End: " + pos2 + "\n New URL: " + newURL);
		
		$(".result").html("<a href=" + "http://www.filehippo.com" + newURL + ">Hi! I'm the correct link!</a>");
	});
}

$(document).ready(
		
		function() {
			
			$("[title=Download Now!]").each(
				function() {
					
					alert("hi! " + $(this).attr("href"));
				
					// $.get($(this).attr("href"), function(data) {
						// $('.result').html(data);
							// alert("?");
							// alert(data);
							// alert("!");
						// }
					// );
				}
			);
			
			
			// $(".result").load("http://www.filehippo.com/download_adobe_air/download/61ddb5514d1bf2fec7462ebe39a399cb/");
			
			// inputURL = "http://www.filehippo.com/download_adobe_air/download/61ddb5514d1bf2fec7462ebe39a399cb/";
			
			// $('.result').load('http://localhost/random2.php?url=' + inputURL + " a.black", function(data, status, xhr) {
				// alert(data);				
			// });
			
			
			
			
			
			// $.get('http://localhost/random2.php?url=' + inputURL, function(data) {
				// alert(data);
				// pos = data.indexOf(" class=\"black\" href=\"");		// Length: 21
				// pos2 = data.indexOf("\">If not then please click this link</a>");	// Marks the end of what we want.
				// newURL = data.substring(pos + 21, pos2);
				
				// alert(" Start: " + pos + "\n End: " + pos2 + "\n New URL: " + newURL);		
				
				// newHTML = "<a href=" + "http://www.filehippo.com" + newURL + ">Hi! I'm the correct link!</a>";
				
				// alert(newHTML);
				
				// $(".result").html(newHTML);
			// });
			
				// newURL = data.substring(data.indexOf("url=") + 4, data.length - 3);
				// newURL = "http://www.filehippo.com" + newURL;
				// alert(newURL);
			// });
			
			
			// $.get('ajax/test.html', function(data) {
			  // $('.result').html(data);
			  // alert('Load was performed.');
			// });
			
			// $.get("http://www.filehippo.com/download_adobe_air/download/61ddb5514d1bf2fec7462ebe39a399cb/", function(data) {
				
				// alert("!");
				// alert(data);
				// alert("?");
				// $('.result').html(data);
				// alert("?");
				// alert(data);
				// alert("!");
				// }
			// );
		}
	);

</script>

</body></html>