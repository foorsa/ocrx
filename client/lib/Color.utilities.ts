function rgbToHex(r: number, g: number, b: number) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function hexToRgb(hex: string, result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)) {
    const Result: any = result ? result.map(i => parseInt(i, 16)).slice(1) : null
    return Result as string;
    //returns [23, 14, 45] -> reformat if needed
}

export { rgbToHex, hexToRgb };