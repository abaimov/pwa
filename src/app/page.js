import DynamicContent from "@/app/components/DynamicContent";


export default function Home() {
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <div>
                <h1>Статический контент, который кэшируется</h1>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto atque deleniti id rem saepe?
                    Delectus, ducimus earum, enim exercitationem facilis illum iure magni molestiae provident quidem
                    quos tempore unde voluptatibus.
                </p>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto atque deleniti id rem saepe?
                    Delectus, ducimus earum, enim exercitationem facilis illum iure magni molestiae provident quidem
                    quos tempore unde voluptatibus.
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto atque deleniti id rem saepe?
                    Delectus, ducimus earum, enim exercitationem facilis illum iure magni molestiae provident quidem
                    quos tempore unde voluptatibus.
                </p>
            </div>
            <DynamicContent />
        </div>
    );
}