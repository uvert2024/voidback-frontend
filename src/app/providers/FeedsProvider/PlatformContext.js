'use client'
import { createContext, useState, useContext, useEffect } from "react";
import { API_URL, toAuthHeaders } from "@/app/configs/api";





const PlatformContext = () => {

  const [platformMessage, setPlatformMessage] = useState(false);
  const [fetched, setFetched] = useState(false);



  const getPlatformMessage = async () => {

    const response = await fetch(
      API_URL+`platform/message`,
      {
        method: "GET",
        headers: toAuthHeaders({})
      }
    );

    if(response.status===200)
    {
      const data = await response.json();

      setPlatformMessage(data);

    }

    setFetched(true);
  }


  useEffect(()=> {
    if(!platformMessage && !fetched)
      getPlatformMessage();
  }, [!platformMessage, !fetched])


  const context = {
    platformMessage,
  };


  return createContext(context);

  }



export default PlatformContext;