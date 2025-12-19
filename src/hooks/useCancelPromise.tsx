//? this is the legacy way of cancel any promise also it is the interview question as well we convert into hook;

//user send promise using our hook and we have to cancel it and return an error;

export const useCancelPromise =<T extends Promise<T>>(promise:T) => {
 
    //let variable cancel to store function.
    let cancel;

    const wrappedPromise = new Promise((res,rej)=>{
        cancel = ()=> rej(new Error("Promise is Cancelled..."))
        promise.then(res).catch(rej);
    });

    return {promise:wrappedPromise, cancel};
};


// Usage example:->
// const {promise,cancel} = useCancelPromise(
//     new Promise((resolve)=>{
//         setTimeout(() => {
//             resolve("Data....")
//         }, 1000);
//     })
// );

// getting results:->
// promise.then(console.log).catch((err)=>console.error(err)); 

// cancel promise :-
// setTimeout(cancel!,1000);
