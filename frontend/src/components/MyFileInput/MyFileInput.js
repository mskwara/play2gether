import React, { useRef } from "react";
import "./MyFileInput.scss";

const MyFileInput = (props) => {
    const hiddenFileInput = React.useRef(null);

    const browse = (e) => {
        console.log("browse");
        hiddenFileInput.current.click();
        // const files = e.target.files || e.dataTransfer.files;
        // if (!files.length) return;
        // this.photo = files[0];
        // this.$emit("photo-change", this.photo);
        // this.filename = document.getElementById("file").files[0].name;
    };
    return (
        <div id="MyFileInput" className={props.className}>
            <button onClick={browse}>Upload file</button>
            <input
                onChange={props.uploadFile}
                id="file"
                type="file"
                ref={hiddenFileInput}
            />
        </div>
    );
};

export default MyFileInput;
