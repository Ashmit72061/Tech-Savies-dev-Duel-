import { useState, useEffect } from "react";

const TestPage = () => {
    const [data, setData] = useState(null);
    useEffect(() => {

        const fetchData = async () => {
            const response = await fetch(import.meta.env.VITE_API_URL + '/api/test/simpletest', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const resData = await response.json();
            console.log(resData);
            setData(resData);
        }
        fetchData();
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold">Test Page</h1>
            {data?.map((item) => (
                <>
                <p key={item.id}>"NAME: "+{item.name}</p>
                <p key={item.id}>"FLAT: "+{item.flat}</p>
                </>
            ))}
        </div>
    );
};

export default TestPage;