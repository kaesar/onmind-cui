export interface Item {
    label: string;
    value: string;
}

export class Abstract {
    planeDeserialize(input: string): Item[] {
        const entries = input.split(";");
        const result: Item[] = [];

        try {
            if (input !== "" && input !== "[]") {
                entries.forEach(entry => {
                    const attributes = entry.split(",");
                    const obj: Record<string, string> = {};

                    attributes.forEach(attribute => {
                        const [key, value] = attribute.split("=");
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
