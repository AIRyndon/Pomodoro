import authService from '../components/api-authorization/AuthorizeService'

export const apiRequest = async (uri: string, method: string, id: number = 0, body?: any) =>
{
    if (id !== 0)
    {
        uri = `${uri}/${id}`;
    }

    let headers = new Headers();
    const token = await authService.getAccessToken();

    if (token)
    {
        headers.append('Authorization', `Bearer ${token}`);
    }

    if (method === 'post' || method === 'put')
    {
        headers.append('Content-type', 'application/json');      
    }

    const response = await fetch(uri, {
        body: JSON.stringify(body),
        method: method,
        headers: headers
    });

    if (response.status === 204 ||response.status === 404 || response.status === 400) {
        return;
    }
    else {
        return await response.json();
    }
};