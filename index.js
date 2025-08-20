function FormatInput(){
    var input = document.getElementById("input_XML").value;
    
    fetch('/format', {
        method: "POST",
        headers: {
            'Content-Type': "application/json"  
        },
        body: JSON.stringify({xmlInput: input})
    })
    .then(response => {
        console.log("2. Response status:", response.status);
        return response.json();
    })
    .then(data => {
        console.log("3. Data ricevuta:", data);
        if(data.success) {
            document.getElementById("output_XML").value = data.formatted;
        } else {
            document.getElementById("output_XML").value = "Error: " + data.error;
        }
    })
    .catch(error => console.error('4. Error:', error));
}

function ClearInput(){
    document.getElementById("input_XML").value="";
   
}