<?php
{
 // Make sure we have the correct number of args
 // $args = $_SERVER['argv'];
 // if (2 != $_SERVER['argc']) {
   // echo "Format: $args[0] <filename>\n";
   // exit(-1);
 // }
 // $filename = $args[1];

 // Read the input file into a json string
 $jsonStore = file_get_contents("sessionstore.js") or die("Failed to open input file");

 // Convert the json string into an object
 $store = json_decode($jsonStore);

 // Create an output .html file
 $file = fopen("test.html", "w") or die("Failed to create output file");

 // Add HTML header
 fwrite($file, "<html><body><ul>\n");

 // Parse the session store object and generate HTML links for each tab.
 // Session stores have windows->tabs->entries array-of-arrays structure.
 $windows = $store->windows;
 foreach ($windows as $window) {
   $tabs = $window->tabs;
   foreach ($tabs as $tab) {
     $entries = $tab->entries;
     foreach ($entries as $entry) {
       fwrite($file, "<li><a href=\"$entry->url\">" . $entry->title . "</a>\n");
     }
   }
 }

 // Add HTML footer
 fwrite($file, "</ul></body></html>\n");

 // Close the output file
 fclose($file);
}