export default function Layout(props: {
    children: React.ReactNode;
    modal: React.ReactNode;
}) {
    return (
        <div className="relative w-full h-auto min-h-screen d-flex flex-col justify-start items-start">
            {props.children}
            {props.modal}
        </div>
    );
}
