export interface Item {
    label: string;
    value: string;
}

export class Abstract {

    planeDeserialize(input: string): Item[] {
        const entries = input.split(";");
        const result: Item[] = [];
        //const result: Array<{ [key: string]: string }> = [];

        try {
            if (input !== "" && input !== "[]") {
                entries.forEach(entry => {
                    const attributes = entry.split(",");
                    //const obj: Item = { label: "", value: "" };
                    const obj: { [key: string]: string } = {};
    
                    attributes.forEach(attribute => {
                        const [key, value] = attribute.split("=");
                        //obj.label = key; obj.value = value;
                        obj[key] = value;
                    });
    
                    result.push(obj as unknown as Item);
                });
            }
        }
        catch (iobe) {
            console.log("planeDeserialize => IndexOutOfBounds! input =", input);
        }
    
        return result;
    }

}
