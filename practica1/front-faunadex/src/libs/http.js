
let http = {}

http.get = async (url) => {
    try {
        let req = await fetch(url, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
        });
        let json = await req.json();
        return json;
    } catch (error) {
        console.log("http get method err", error);
        throw new Error(error);
    }
}

http.post = async (url, body) => {
    try {
        let req = await fetch(url, {
            method: "POST",
            body: JSON.stringify(body), // data can be `string` or {object}!
            headers: {
                'Content-Type': 'application/json'
            },
        });

        let json = await req.json();
        return json;
    } catch (error) {
        console.log("http post method err", error);
        throw new Error(error);
    }
}

http.put = async (url, body) => {
    try {

        let req = await fetch(url, {
            method: "PUT",
            body: JSON.stringify(body), // data can be `string` or {object}!
            headers: {
                'Content-Type': 'application/json'
            },
        });

        let json = await req.json();
        return json;

    } catch (error) {
        console.log("http post method err", error);
        throw new Error(error);
    }
}

http.delete = async (url) => {
    try {
        let req = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        let json = await req.json();
        return json;
    } catch (error) {
        console.log("http get method err", error);
        throw new Error(error);
    }
}

export default http