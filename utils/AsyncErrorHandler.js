

const AsyncErrorHandler = func => {
  return (req,res,next) => {
    func(req,res,next).catch(next);
  };
}


module.exports = AsyncErrorHandler;