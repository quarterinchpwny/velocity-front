const trimPayload = (payload, exceptions = []) => {
    try {
        const _payload = Object.assign({}, payload);
        const keys = Object.keys(payload);
        keys.forEach((key) => {
            const field = _payload[key];
            if (!exceptions.includes(key) && typeof field === "string") {
                _payload[key] = field.trim();
            }
        });

        return _payload;
    } catch (error) {
        return payload;
    }
};

export default trimPayload;
