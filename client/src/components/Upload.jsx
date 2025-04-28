import { IKContext, IKUpload } from "imagekitio-react";
import { useRef } from "react";
import { toast } from "react-toastify";

// Fetch image with authentication
const authenticator =  async () => {
    try {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/posts/upload-auth`
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Request failed with status ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        const { signature, expire, token } = data;
        return { signature, expire, token };
    } catch (error) {
        throw new Error(`Authentication request failed: ${error.message}`);
    }
};

const Upload = ({ children, type, setData }) => {

    // use ref hook
    const ref = useRef(null)

    // onError Function
  const onError = (err) =>{
    console.log(err);
    toast.error("Media Upload Failed!");
  };

  // onSuccess Function
  const onSuccess = (res) =>{
    console.log(res);
    setData(res);
    toast.success("Media Upload was Successful!");
  };

  return (
    <IKContext 
        publicKey={import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY} 
        urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT} 
        authenticator={authenticator} 
    >
        <IKUpload
            // use unique file name for files
            useUniqueFileName

            // Handle on error and on success functions
            onError={onError}
            onSuccess={onSuccess}

            // hide upload button
            className="hidden"

            // use ref
            ref = {ref}

            // use type
            accept={`${type}/*`}
        />
        <div className="cursor-pointer" onClick={() => ref.current.click()}>{ children }</div>
    </IKContext>
  )
}

export default Upload