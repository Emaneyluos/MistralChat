import hljs from 'highlight.js';

document.addEventListener('DOMContentLoaded', () => {
    const messageText  = document.getElementById("messageText");
    const messageSize = document.getElementById("messageSize");
    const responseDiv = document.getElementById('response');
    const sendButton = document.getElementById("inputButton");



    sendButton.addEventListener("click", async event => {
        await callMistral(event);
    });

    messageText.addEventListener('keypress', async event => {
        if (event.code === 'Enter' && event.shiftKey == false) {
            await callMistral(event);
        }
    });


     async function callMistral (event) {
        event.preventDefault();
        const text = messageText.value;
        const size = messageSize.value;

        //Disabled sending new request
        sendButton.disabled = true;
        sendButton.style.backgroundColor = '#ccc';
        messageText.disabled = true;
        messageText.style.backgroundColor = '#ccc';



        //Display input of User
        const userInput = document.createElement('p');
        userInput.style.whiteSpace = 'pre-wrap'
        userInput.innerHTML = escapeHtml(`User : ${text}`);
        responseDiv.insertBefore(document.createElement('hr'), responseDiv.firstChild);
        responseDiv.insertBefore(userInput, responseDiv.firstChild);
        messageText.value = '';


        try {
            const response = await fetch('/sendMessage', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({text, size}),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            let responseData = await response.json();
            console.log(responseData);

            // const input = escapeHtml("User : " + messageText.value);
           

            const mistralOutput = document.createElement('p');
            mistralOutput.style.whiteSpace = "pre-wrap";
            responseDiv.insertBefore(document.createElement('hr'), responseDiv.firstChild);

            
            let searchForCode = true;

            while (searchForCode) {
                let codePosition = findCode(responseData);

                if (codePosition !== -1){
                    let normalText = responseData.substring(0, codePosition[0]);
                    let code = responseData.substring(codePosition[0] + 3, codePosition[1]);
                    responseData = responseData.substring(codePosition[1] + 3);

                    mistralOutput.innerHTML += escapeHtml(normalText);
                                        
                    let languageAndCode = getLanguageAndCleanCode(code);
                    languageAndCode[1] = escapeHtml(languageAndCode[1]);

                    mistralOutput.innerHTML += `<pre>${languageAndCode[0]}<code class="language-${languageAndCode[0]}">` + languageAndCode[1] + `<\code><\pre>`;
                } else {
                    searchForCode = false;
                }
            }


            mistralOutput.innerHTML += escapeHtml(responseData);
            responseDiv.insertBefore(mistralOutput, responseDiv.firstChild);

    


        } catch (err) {
            console.error('Erreur: ', err);
        } finally {
            sendButton.disabled = false;
            sendButton.style.backgroundColor = '';
            messageText.disabled = false;
            messageText.style.backgroundColor = '';
        }



        hljs.highlightAll();

    }

});

function escapeHtml(str) {
    return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function findCode (str) {
    let subStr = "```";

    let firstPosition = str.indexOf(subStr);

    if (firstPosition !== -1) {
        let secondPosition = str.indexOf(subStr, firstPosition + 3);
        if (secondPosition !== -1) {
            return [firstPosition, secondPosition];
        } else {
            return -1;
        }
    } else {
        return -1;
    }
}

function getLanguageAndCleanCode (str) {
    let arrayWord = str.split('\n');
    let positionOfCode = str.indexOf('\n');
    str = str.substring(positionOfCode);
    let languageUsed = arrayWord[0];

    return [languageUsed, str];

}
