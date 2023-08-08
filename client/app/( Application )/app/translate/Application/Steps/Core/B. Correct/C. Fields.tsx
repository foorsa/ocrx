import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setDocumentType } from "@/redux/actions/documentTypeActions";
import { Doctype, Field } from "@/redux/types/states/Document Type";
import { setSession } from "@/redux/slices/sessionSlice";

export default function Fields() {
    const dispatch = useAppDispatch();
    const Doctype: Doctype | null = useAppSelector(
        (state) => state.documentType
    );
    const Session = useAppSelector((state) => state.session);

    const Values = Session?.Data?.Translation?.Text;

    const handleFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        // Set the value in the session
        if (Session?.Data?.Translation?.Text) {
            // Disptach
            dispatch(
                setSession({
                    ...Session,
                    Translation: {
                        ...Session?.Data?.Translation,
                        Text: {
                            ...Session?.Data?.Translation?.Text,
                            [name]: value,
                        },
                    },
                })
            );
        }
    };

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
                                  defaultValue={
                                      Values ? Values[field.name] : ""
                                  }
                                  id={field.name}
                                  name={field.name}
                                  required={field.required}
                                  className="bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-zinc-900 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                  onChange={handleFieldChange}
                              />
                          </div>
                      );
                  })
                : null}
        </div>
    );
}
