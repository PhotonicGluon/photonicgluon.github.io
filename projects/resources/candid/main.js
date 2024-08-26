// Constants
LAYERS = [
    null,
    { offset: "cd9f9f068c47c03292b669b85d1f7c0ea91734041c1a98cd", check: "ed68404b" },
    { offset: "e73f6121dbd67a0cf4a8b781699becbcf7d82185de5544c2", check: "6f415937" },
    { offset: "c303d8ce599a97c0cf94ce166fa04cbaef99e33c3d91d1a1", check: "4f3a3d1e" },
    { offset: "4c185894ebb556bb31d7671ad7a2f8e340bc15f87922ab32", check: "f2c94689" },
    { offset: "a4b033d2bf06f1a142c888faa74cea3bd873e5e7e00f0923", check: "ecbf33c7" },
    { offset: "0c31b75204c63e0dcb408b8ffb34777bb4dcefd48d8b843b", check: "4dce8ede" },
    { offset: "104c8030fa71666fc5318487de00a8fc8a6f1c171355040a", check: "0459485c" },
    { offset: "227fdc9b8ea021ffb8944a2665302f49772ad041d83d9fe1", check: "f5689c2c" },
    { offset: "e1de7a3d6d5637da6aadb7fe04878d92cc7c889138f33b45", check: "2aaf723d" },
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
