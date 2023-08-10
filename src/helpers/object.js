const objectHelper = {
    isSame: (object1, object2) => {
        const keys1 = Object.keys(object1);
        const keys2 = Object.keys(object2);
        if (keys1.length !== keys2.length) {
            return false;
        }
        for (const key of keys1) {
            const val1 = object1[key];
            const val2 = object2[key];
            const areObjects =
                objectHelper.isObject(val1) && objectHelper.isObject(val2);
            if (
                (areObjects && !objectHelper.isSame(val1, val2)) ||
                (!areObjects && val1 !== val2)
            ) {
                return false;
            }
        }
        return true;
    },

    isObject: (object) => {
        return object != null && typeof object === "object";
    },

    hasValue: (object) => {
        if (!object) {
            return false;
        }
        return (
            Object.keys(object).length > 0 &&
            Object.getPrototypeOf(object) === Object.prototype &&
            Object.values(object).filter((item) => item).length > 0
        );
    },
};

export default objectHelper;
