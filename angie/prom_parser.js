async function process(r) {
    function error(status, message) {
        r.error(message);
        r.return(500, message);
        return 1;
    }

    let data = '';

    r.headersOut['Content-Type'] = 'text/plain';

    if (! r.variables.fetch_url ) {
        return error(500, 'undefined "fetch_url" variable');
    }

    try {
        let reply = await ngx.fetch(r.variables.fetch_url);

        if (reply.status != 200) {
            return error(500,'defind URL returned status ' + reply.status);
        }

        let text = await reply.text();

        data = JSON.parse(text);
    } catch(e) {
      return error(500, e);
    }


    r.return(200, processData('angie', data).replace(/[\.-]/g, '_'));
}

function processData(pname, pvalue) {
    let output = '';

    if (typeof pvalue == 'object') {
        for (let key in pvalue) {
            output += processData(`${pname}_${key}`, pvalue[key]);
        }

        return output;
    } else {
        return `${typeof pvalue != 'number'?'#':''}${pname} ${pvalue}\n`;
    }
}

export default {process}
