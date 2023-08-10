
// // enable syntax highlighting
// hljs.initHighlightingOnLoad();
//
// $(document).ready(function() {
//   if(isFileAPIAvailable()) {
//     $('#files').bind('change', handleDialog);
//     // debugger;
//   }
// });
//
// function handleDialog(event) {
//   var files = event.target.files;
//   var file = files[0];
//
//   var fileInfo = `
//     <span style="font-weight:bold;">${escape(file.name)}</span><br>
//     - FileType: ${file.type || 'n/a'}<br>
//     - FileSize: ${file.size} bytes<br>
//     - LastModified: ${file.lastModifiedDate ? file.lastModifiedDate.toLocaleDateString() : 'n/a'}
//   `;
//   $('#file-info').append(fileInfo);
//
//   var reader = new FileReader();
//   reader.readAsText(file);
//   reader.onload = function(event){
//     var csv = event.target.result;
//     var data = $.csv.toArrays(csv);
//     $('#result').empty();
//     $('#result').html(JSON.stringify(data, null, 2));
//   }
// }

//
// hljs.initHighlightingOnLoad();
// // I have set a global data array.
// $(document).ready(function() {
//   if(isFileAPIAvailable()) {
//     $('#files').bind('change', handleDialog);
//     $('#run').bind('click',take_data_and_make_family_csv);
//   }
// });
//
// function handleDialog(event) {
//   var files = event.target.files;
//   var file = files[0];
//
//   var fileInfo = `
//     <span style="font-weight:bold;">${escape(file.name)}</span><br>
//     - FileType: ${file.type || 'n/a'}<br>
//     - FileSize: ${file.size} bytes<br>
//     - LastModified: ${file.lastModifiedDate ? file.lastModifiedDate.toLocaleDateString() : 'n/a'}
//   `;
//   $('#file-info').append(fileInfo);
//
//   var reader = new FileReader();
//   reader.readAsText(file);
//   reader.onload = function(event){
//     var csv = event.target.result;
//     data = $.csv.toArrays(csv);
//     // $('#result1').empty();
//     $('#result1').html(JSON.stringify(data, null, 2));
//   }
// }



  // enable syntax highlighting
  // hljs.initHighlightingOnLoad();

  function arrayToXlxs(arrayofarray){
    var wb = XLSX.utils.book_new();
    wb.Props = {
            Title: "Star Health Family Card",
            Subject: "Family cards",
            Author: "Rajeev Sahasrabudhe",
            CreatedDate: new Date(),
    };

    wb.SheetNames.push("Sheet1");
    var ws_data = arrayofarray;
    var ws = XLSX.utils.aoa_to_sheet(ws_data);
    wb.Sheets["Sheet1"] = ws;

    var wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});
    function s2ab(s) {

            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;

    }
    saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), 'csvToXlsxfileSorted.xlsx');
    // $("#button-downloadXLSX").click(function(){
    //         saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), 'csvToXlsxfile.xlsx');
    // });

  }




  function take_data_and_make_family_csv(data){
      target_array_setup();
      // alert(data);
      // data=parse(); //The data from above input section is now available.
      // Parse creates an array data. This contains source data.
      // Source source_data_setup() checks source data for sanity.
      source_data_setup(data);
      // Insert headings of target_heading_array into result_data
      result_data=[[]];
      result_data=insert_heading_in_result_data(target_heading_array,result_data);
      // This is a variable for number of family members which can be accommodated in a card.
      // This can work till five members. If members are more, the target target_match_making_array should be increased with
      // postfix 6, 7 etc. Similar to earlier postfix numbers in the target_match_making_text.
      lines_available_in_card=5;
      // start of line is from 1 to 5. total 5 lines available.
      current_line=1; // initiating first line. This counter will go till lines_available_in_card
      //Then it will again start from one for the next card.
      // It will be reset to 1 each time the family changes or its value exeed lines_available_in_card.
      total_individual_data_count=data.length; // This is total records in csv source data.
      i=1; //first index 0 is of heading. So data starts from index 1.
      card_per_family=1; // Initiating the card. Usually it will always be 1. It will change only if same family has members more than
      // lines_available_in_card.
      // alert(target_match_making_array);
      familyIdColumn =1;// This is the second column called customer id. It has two parts. first part is common for a family. then hypen - and second part is a incrementing number for each member
      family_id=data[i][familyIdColumn].split("-")[0];
      stored_family_id=family_id;
      target_row_index=1 // This is the starting index to insert data in result_data. Index 0 being heading.
      while (i<total_individual_data_count) {
        family_id=data[i][familyIdColumn].split("-")[0];
        if (stored_family_id != family_id){
          stored_family_id=family_id // Set stored_family_id to new family_id
          //increment the target_row_index so that next card is made
          target_row_index++;
          current_line=1; //reset to one so that first line on next card is filled now.
        }
        if (current_line>5){
          current_line=1;// if current line is more than five means same family has more than five members.
          target_row_index++;// Thus we have to start next card and reset the current line to 1 so that it takes in from line 1 in print.
        }
        result_data=insert_source_record_in_target(i, data, target_row_index, result_data,current_line,target_match_making_array)

        current_line++; //increment for next line on the card
        i++;
      }
      json1= JSON.stringify(result_data, null, 2)
      $('#result').html(json1);
      // alert("Your target file is ready. Now I will prepare csv of this array.")

      // result_data is the actual array of arrays data to be used.
      // Now trying to download as xlsx
      arrayToXlxs(result_data);
      // csvContent=Make_csv(result_data);
      // alert(csvContent);
      // download_file(csvContent);

      return result_data.length;
  }
  // $(document).ready(() => {
  //
  //
  //
  //
  //
  // });
  //The above set of code was earlier used when document is ready and we used our hard coded source data.


  function download_file(csvContent){
    var encodedUri = encodeURI(csvContent);
    window.open(encodedUri);
  }


  function Make_csv(result_data){
    let csvContent = "data:text/csv;charset=utf-8,";//data:text/csv;charset=utf-8,\r\n was there earlier but that was giving a blank first row in the resulting csv file.
    result_data.forEach(function(rowArray) {
        let row = rowArray.join(",");
        csvContent += row + "\r\n";
    });
    return csvContent;
  }

  function checkIfUnique(arr){
    // checks if all items in arr are unique and returns true otherwise alerts and return false.
    for (var i = 0; i < arr.length; i++) {
      item = arr[i];
      if (i != (arr.indexOf(item))){
        // alert("Duplicate item with index: "+i);
        // alert(item+" heading is not unique. Make it unique and try again.");
        return false;
      }
    }
    return true;
  }


  function insert_source_record_in_target(source_index, source_data, target_row_index, result_data,current_line,target_match_making_array){
    source_headings=source_data[0];
    current_source_record=data[source_index];
    // Insert blank record of desired length. only if required.
    if (result_data.length <= target_row_index){
      target_blank_row_array=" , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ".split(",");
      result_data.push(target_blank_row_array);
    }

    // Traverse through all source fields for this source record and paste it in target record.
    for (var i = 0; i < current_source_record.length; i++) {
      search_heading_in_target="$"+source_headings[i]+current_line;
      target_index_found=target_match_making_array.findIndex(check_heading);
        function check_heading(heading){
          return heading==search_heading_in_target;
        }
      if (target_index_found>=0){
        // alert("Target index is found: "+target_index_found)
        // alert(result_data);
        result_data[target_row_index][target_index_found]=current_source_record[i];
        // alert(result_data);
      }
    }
    return result_data;
  }


  function checkIf_allRowsHaveEqualNumberOfItems(a){
    heading_length = a[0].length;
    //  Using toReturn as a boolean variable to set it to return false even if one instance
    // of mismatch is found. But we are moving through complete for loop to show more mismatches.
    //  Thus user can note it down and correct all the rows with problems.
    toReturn = true;
    message = "";
    for (var i = 0; i < a.length; i++) {
      if (a[i].length != heading_length){
        message +=("Data Row number: "+(i) +" is having "+(a[i].length-heading_length)+" more items than heading row.'\n");
        // alert(message)
        toReturn = false;
      }
    }
    return toReturn;
  }

  function insert_heading_in_result_data(target_heading_array,result_data){
    result_data[0]=target_heading_array;
    json1= JSON.stringify(result_data, null, 2)
    $('#result').html(json1);
    return result_data;
  }


  function data_by_family(data){
    // To convert individual records to one record per family.
    // The first part of ID card number is used to identify family.
    // This is second column in the data. That is index 1
    result_data=[];
    i=0;
    stored_family_id="something";
    family_id="start";
    family_record=[];
    family_id=data[i][1].split("-")[0];
    stored_family_id=family_id;

    while(i<data.length){
      family_id=data[i][1].split("-")[0]
      if (stored_family_id == family_id){
        family_record = family_record.concat(data[i])
      }else{
        result_data.push(family_record);
        family_record=[];
        family_record = family_record.concat(data[i]);
      }
      stored_family_id = family_id;
      i = i+1;
    }
    return result_data;
  }

  function target_array_setup(){
    target_heading_text ="Policy NO1	Customer Name1	Date1	Gender1	ID Card No1	Customer Name2	Date2	Gender2	ID Card No2	Customer Name3	Date3	Gender3	ID Card No3	Customer Name4	Reserved1	Reserved2	BON	Policy Fm Date1	PMS	PBS	Date4	Gender4	ID Card No4	Customer Name5	Date5	Gender5	ID Card No5	Office Code1	Reserved4	TA_SSM_SM_Code	Reserved5	Reserved6	Reserved7";
    target_match_making_text = "$Policy NO1	$Customer Name1	$DOB1	$Gender1	$ID Card No1	$Customer Name2	$DOB2	$Gender2	$ID Card No2	$Customer Name3	$DOB3	$Gender3	$ID Card No3	$Customer Name4	Reserved1	Reserved2	$BON	$Policy Fm Dt1	$PMS	$PBS	$DOB4	$Gender4	$ID Card No4	$Customer Name5	$DOB5	$Gender5	$ID Card No5	$Office Code1	Reserved4	$TA/SSM/SM Code1	Reserved5	Reserved6	Reserved7";
    target_heading_array=target_heading_text.split("	");
    target_match_making_array=target_match_making_text.split("	");
    // target_blank_row_array=make_array([" "],target_heading_array.length);
    // function make_array(str=["a"],num){
    //   arr=[num];
    //   for (var i = 0; i < num; i++) {
    //     arr[i]=str;
    //   }
    //   return arr;
    // }
    // alert("target heading array is: "+target_heading_array);
    // alert("target_match_making_array is: "+target_match_making_array);
    // alert("Target blank row array is created: "+target_blank_row_array);
    // alert("Length of three arrays are :"+target_heading_array.length +" and "+ target_match_making_array.length)//+ " blank row array length is: " +target_blank_row_array.length)

    checkIfUnique(target_heading_array);
    checkIfUnique(target_match_making_array);
  }

  function source_data_setup(data){
    headings = data[0];
    stored_headings_array=["Sr.No","ID Card No","Customer Name","DOB","Age","Gender","Office Code","Policy Fm Dt","TA/SSM/SM Code","Agent/Broker/TE Code","Policy NO","Pol Issue DT"]
    // stored_headings_array=stored_headings_string.split(",");
    // alert("Stored headings array is:"+stored_headings_array);
    result_of_comparision=""
    mismatchFound=false;
    stored_headings_array.forEach((item, i) => {
      if (item.toString() == headings[i]){
        result_of_comparision+="Sr. "+i+" Stored_heading: "+item+' \r\n Heading given by you: '+headings[i]+"\r\n"
      }else{
        mismatchFound=true;
        result_of_comparision+="**** MisMatch in heading here...****\r\n"+"Sr. "+i+"stored_heading: "+item+' heading given by you: '+headings[i]+"\r\n"+"****\r\n"
        alert("You will not get results for "+item+ "\r\n You should ignore the output csv you will get \r\n and repair the csv file heading in the source csv..\r\n"+"Final alert will show all the mismatches together.")
      }
    });
    if (mismatchFound){
      alert("Final Alert: \r\nIgnore the csv you will get now. Correct the headings and try again.\r\nThe headings should match the standard headings you have given us earlier."+result_of_comparision);
    }


    // Check if headings that is top row is having unique elements
    headingsAreUnique = checkIfUnique(headings);
    allRowsHaveEqualNumberOfItems=checkIf_allRowsHaveEqualNumberOfItems(data)
    allIsOkay = headingsAreUnique && allRowsHaveEqualNumberOfItems;
    if (allIsOkay){
      // alert("All headings were found unique. You can continue further.")
      // rec_by_family=data_by_family(data)
      // json1= JSON.stringify(rec_by_family, null, 2)
      // $('#result').html(json1);
    }
  }

  // function parse() {
  //   const input = $('#result1').val();
  //   // alert(typeof(input));
  //   const data = $.csv.toArrays(input);
  //   $('#result').empty();
  //   return data;
  // }
