// module.exports = (fn) => {
//     return function (req, res, next) {
//         fn(req, res, next).catch(next);
//     };
// };
module.exports = (fn) => {
    return function (req, res, next) {
        //console.log('Function passed to wrapAsync:', fn);
        if (typeof fn !== 'function') {
            throw new Error('Passed argument is not a function');
        }
        
        // Wrap the function call in a promise to handle non-promise cases
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
