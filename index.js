let inputEditor, outputEditor;

// Initialize CodeMirror editors when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Input editor (editable)
    inputEditor = CodeMirror.fromTextArea(document.getElementById('input_XML'), {
        mode: 'xml',
        lineNumbers: true,
        styleActiveLine: true,
        matchBrackets: true,
        indentUnit: 2,
        lineWrapping: true,
        placeholder: 'Your malformed xml here'
    });

    // Output editor (read-only)
    outputEditor = CodeMirror.fromTextArea(document.getElementById('output_XML'), {
        mode: 'xml',
        lineNumbers: true,
        styleActiveLine: true,
        matchBrackets: true,
        indentUnit: 2,
        lineWrapping: true,
        readOnly: true,
        placeholder: 'Press Format to see your xml formatted here'
    });
});

function FormatInput(){
    const input = inputEditor.getValue();
    
    fetch('/format', {
        method: "POST",
        headers: {
            'Content-Type': "application/json"  
        },
        body: JSON.stringify({xmlInput: input})
    })
    .then(response => {
        console.log("Response status:", response.status);
        return response.json();
    })
    .then(data => {
        console.log("Data received:", data);
        if(data.success) {
            outputEditor.setValue(data.formatted);
        } else {
            outputEditor.setValue("Error: " + data.error);
        }
    })
    .catch(error => console.error('Error:', error));
}

function ClearInput(){
    inputEditor.setValue("");
    outputEditor.setValue("");
}

function copyToClipboard() {
    const text = outputEditor.getValue();
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            const btn = event.target;
            const originalText = btn.textContent;
            btn.textContent = 'Copied!';
            btn.disabled = true;
            setTimeout(() => {
                btn.textContent = originalText;
                btn.disabled = false;
            }, 1000);
        });
    } else {
        // Fallback for older browsers
        const el = document.createElement("textarea");
        el.value = text;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
    }
}