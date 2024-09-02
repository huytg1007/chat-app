export type Option = {
    value: React.Key | null | undefined; 
    label: string; 
    photoURL: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; 
}