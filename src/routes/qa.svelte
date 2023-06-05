<script>
    import { Configuration, OpenAIApi} from "openai";
    // const { Configuration, OpenAIApi } = require("openai");
    const configuration = new Configuration({
        apiKey: "sk-<your key here>",
    });
    async function ask_gpt(prompt) {
        const openai = new OpenAIApi(configuration);
        const response = await openai.createChatCompletion({
            model: "gpt-4",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            }
        );


        const answer = response.data.choices[0].message['content'];
        console.log(answer);
        alert(answer);
        return answer
    }

    let query;
    let answer;
</script>


Question
<!-- textbox to ask a prompt with placeholder text 'ask a question' -->
<br>
<textarea rows="4" cols="50" placeholder="Ask a question..." bind:value={query}></textarea>
<button on:click={async () => answer = await ask_gpt(query)}>Ask</button>
<hr>
Answer
{answer}
