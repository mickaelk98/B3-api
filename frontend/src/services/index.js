const apiUrl = "http://localhost:4000/api";

export async function signup(data) {
    const response = await fetch(`${apiUrl}/auth/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    const user = await response.json();

    if (response.status === 201) {
        return user;
    } else {
        throw user;
    }
}

export async function login(data) {


    const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.status === 200) {
        document.cookie = `token=${result.token}; path=/;`;
        return result;
    } else {
        throw result;
    }
}