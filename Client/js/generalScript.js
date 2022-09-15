function executeRequest(method, url, handleOk, handleError, data, context, afterOk) {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url)
    xhr.responseType = 'json';

    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status <= 299) {
            if (context) {
                handleOk({ ...xhr.response, ...context });
            } else {
                handleOk(xhr.response);
            }
        } else {
            handleError(`ERROR ${xhr.status}: ${xhr.response.error}`);
        }
    };

    xhr.onerror = function () {
        handleError(`ERROR ${xhr.status}: page not found`);
    };

    if (afterOk) {
        xhr.onreadystatechange = function () {
            if (xhr.readyState >= 2 && xhr.status >= 200 && xhr.status <= 299) {
                afterOk();
            }
        };
    }

    if (data) {
        xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
        xhr.send(data);
    } else {
        xhr.send();
    }
}