export default fn => {
    //  console.log('🟡 catchAsync EXECUTED (app startup)');
    return (req, res, next) => {
        console.log('🟢 Returned middleware RUNNING (request time)');
        fn(req, res, next).catch(next);
    }
}