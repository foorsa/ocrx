import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setDocumentType } from "@/redux/actions/documentTypeActions";
import { Doctype, Field } from "@/redux/types/states/Document Type";

export default function Fields() {
    const dispatch = useAppDispatch();
    const documentType: Doctype | null = useAppSelector(
        (state) => state.documentType
    );

    const [fields, setFields] = React.useState<Field[]>([]);

    useEffect(() => {
        if (documentType && documentType.fields) {
            setFields(documentType.fields);
        }
    }, [documentType]);

    const handleFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        // Update the field in the document type
        if (documentType && documentType.fields) {
            const newFields = documentType.fields.map((field) => {
                if (field.name === name) {
                    field.value = value;
                }
                return field;
            });

            dispatch(setDocumentType({ ...documentType, fields: newFields }));
        }
    };

    return (
        <div className="relative w-full text-left">
            {/* If there's a selected Doctype, Display its fields. */}
            {documentType && documentType.fields
                ? documentType.fields.map((field) => {
                      return (
                          <div className="mb-6" key={field.name}>
                              <label
                                  htmlFor={field.name}
                                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                              >
                                  {field.name}
                              </label>
                              <input
                                  type={field.type}
                                  placeholder={field.description}
                                  defaultValue={field.value}
                                  id={field.name}
                                  name={field.name}
                                  required={field.required}
                                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-violet-500 dark:focus:border-violet-500"
                                  onChange={handleFieldChange}
                              />
                          </div>
                      );
                  })
                : null}
        </div>
    );
}
