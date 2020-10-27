import lang from "./lang/pt_BR.json";

export const defaultTranslator = (term: string) => {
  const properties = term.split(".");
  let text: any = lang;

  for (const prop in properties) {
    if (!properties.includes(prop)) {
      return term;
    }
    text = text[prop];
  }

  return text;
};
