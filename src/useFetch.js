import {useState,useEffect} from 'react';
const useFetch = (url) => {
    const [data,setData] = useState(null);
    const [isPending,setIsPending] = useState(true);
    const [error,setError] = useState(null);

    //beware of infinite re renders due to useEffect
    //[] - empty dependency array ensures it runs the function only once at the first render
    //whenever something inside dependency array's state changes, useEffect will re render the page
    useEffect(() => {
        //used to stop that fetch
        const abortCont = new AbortController();
        //just to simulate the time a request takes
        setTimeout(() => {
            fetch(url,{signal:abortCont.signal})
                .then(res => {
                    if(!res.ok){
                        throw Error('Could not fetch the data for that resource');
                    }
                    else
                        return res.json();
                })
                .then((data) => {
                    setIsPending(false);
                    setError(null);
                    setData(data);
                })
                .catch(err => {
                    if(err.name === 'AbortError'){
                        console.log('fetch aborted');
                    }
                    else{
                        isPending(false);//not show loading message
                        setError(err.message);
                    }
                });
        },1000)

        return () => abortCont.abort();
    },[url]);
    return {data,isPending,error}
}

export default useFetch;