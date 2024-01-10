export async function onRequestPost({request, env}) {
  try {
    const body = await request.json()
    const url = 'https://api-free.deepl.com/v2/translate'
    const authKey = env.VITE_DEEPL_AUTH_KEY
    const text = body.text
    const sourceLang = body.sourceLang
    const targetLang = body.targetLang
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': 'DeepL-Auth-Key ' + authKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text,
        source_lang: sourceLang,
        target_lang: targetLang,
      })
    })
    const data = await response.json()
    return new Response(JSON.stringify(data), {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers
    })
  } catch (error) {
    console.log(error)
  }
}