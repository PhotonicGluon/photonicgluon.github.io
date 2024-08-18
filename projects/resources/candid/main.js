// Constants
LAYERS = [
    null,
    { offset: "bfcb54977d90918f62e108d4a2b79d7cd54927d84de6739c", check: "e60134bf" },
    // { offset: "abcd", check: "efgh" },
    // { offset: "abcd", check: "efgh" },
    // { offset: "abcd", check: "efgh" },
    // { offset: "abcd", check: "efgh" },
    // { offset: "abcd", check: "efgh" },
    // { offset: "abcd", check: "efgh" },
    // { offset: "abcd", check: "efgh" },
    // { offset: "abcd", check: "efgh" },
]

// Elements
let layerNumElem = $("#layerNum");
let layerPasswordElem = $("#layerPassword");
let layerSubmitElem = $("#layerSubmit");
let layerResultElem = $("#layerResult");

// Functions
function get_inputs() {
    let layerNum = parseInt(layerNumElem.get(0).options[layerNumElem.get(0).options.selectedIndex].text);
    let layerPassword = layerPasswordElem.get(0).value;

    return { number: layerNum, password: layerPassword };
}

function check_and_return_drive_id(password, layerNum) {
    if (layerNum < 0 || layerNum >= LAYERS.length) {
        throw Error(`Invalid layer number ${layerNum}`);
    }

    // Get the appropriate layer's values
    let offset = LAYERS[layerNum].offset;
    let correctCheck = LAYERS[layerNum].check;

    // Compute the drive ID
    let driveID = compute_drive_id(password, offset);
    let computedCheck = sha256(driveID).substring(56);
    console.log(computedCheck);

    if (computedCheck == correctCheck) {
        return driveID;
    } else {
        return false;
    }
}

function download_file(driveID) {
    let downloadLink = `https://drive.google.com/uc?export=download&id=${driveID}`;
    window.open(downloadLink, "_blank");
}

function display_result(text) {
    layerResultElem.text(text);
    setTimeout(() => {
        layerResultElem.text("");
    }, 2000);
}

// Main code
layerSubmitElem.on("click", () => {
    let inputs = get_inputs();
    let result = check_and_return_drive_id(inputs.password, inputs.number);
    if (!result) {
        display_result("Wrong");
    } else {
        display_result("Correct");
        download_file(result);
    }
});
