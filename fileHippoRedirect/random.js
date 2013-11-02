$(document).ready(
	function() {
		
		$("#gavin").click(
			function() {
				
				myurl = $(this).attr("href");
				alert(myurl);
				
				// $(this).attr("href", "http://www.google.com");
				
				$.getJSON("http://query.yahooapis.com/v1/public/yql?"+
						"q=select%20*%20from%20html%20where%20url%3D%22"+
						encodeURIComponent(myurl)+
						"%22&format=xml'&callback=?",
					function(data) { //get information about the user usejquery from twitter api
						data2 = data.results[0];
						alert(data2);
						
						pos = data2.indexOf(' class="black" href="');		// Length: 21
						tempURL = "http://www.filehippo.com" + data2.substring(pos + 21);
						newURL = tempURL.substring(0, tempURL.indexOf('"'));
						
						alert(newURL);
						
						$(self).attr("href", newURL);
					}
				);
				
				alert(myurl);
				
			}
		
		);
		
		// alert("O,o");
		
		// $("[title='Download Now!']").each(
			// function(index) {
			
				// var self = this;
				
				// myurl = $(self).attr("href");
				
				// $.getJSON("http://query.yahooapis.com/v1/public/yql?"+
						// "q=select%20*%20from%20html%20where%20url%3D%22"+
						// encodeURIComponent(myurl)+
						// "%22&format=xml'&callback=?",
					// function(data) { //get information about the user usejquery from twitter api
						// data2 = data.results[0];
						// alert(data2);
						
						// pos = data2.indexOf(' class="black" href="');		// Length: 21
						// tempURL = "http://www.filehippo.com" + data2.substring(pos + 21);
						// newURL = tempURL.substring(0, tempURL.indexOf('"'));
						
						// alert(newURL);
						
						// $(self).attr("href", newURL);
					// }
				// );
			// }
		// );
	}
);