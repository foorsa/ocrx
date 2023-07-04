import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setDocumentType } from "@/redux/actions/documentTypeActions";
import { Doctype, Field } from "@/redux/types/states/Document Type";

export default function Fields() {
    const dispatch = useAppDispatch();
    const Doctype: Doctype | null = useAppSelector(
        (state) => state.documentType
    );

    const handleFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        // Update the field in the document type
        if (Doctype && Doctype.fields) {
            const newFields = Doctype.fields.map((field) => {
                if (field.name === name) {
                    field.value = value;
                }
                return field;
            });

            dispatch(setDocumentType({ ...Doctype, fields: newFields }));
        }
    };

    console.log("Second Step Soctype: ", Doctype);

    return (
        <div className="relative w-full text-left">
            {/* If there's a selected Doctype, Display its fields. */}
            {Doctype && Doctype.fields
                ? Doctype.fields.map((field) => {
                      return (
                          <div className="mb-6" key={field.name}>
                              <label
                                  htmlFor={field.name}
                                  className="block mb-2 text-sm font-medium text-zinc-900 dark:text-white"
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
                                  className="bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 dark:bg-zinc-900 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500"
                                  onChange={handleFieldChange}
                              />
                          </div>
                      );
                  })
                : null}
        </div>
    );
}
