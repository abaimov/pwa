import LinksComponent from "@/app/components/LinksComponent";

export default async function Home() {
    // Запасной URL на случай, если оба сервера не доступны
    let posts = {link: "https://fallback-link.com"};

    try {
        // Пытаемся получить данные с основного API
        const data = await fetch('http://localhost:3000/api/links');
        if (!data.ok) {
            throw new Error('Ошибка при получении данных с API localhost:3000');
        }
        posts = await data.json();
    } catch (error) {
        console.error('Ошибка при получении данных с localhost:3000, пробуем localhost:8000:', error);
        try {
            // Если основной сервер не доступен, пробуем второй сервер
            const fallbackData = await fetch('http://localhost:3000/api/linkupdate', {cache: "no-cache"});
            if (!fallbackData.ok) {
                throw new Error('Ошибка при получении данных с API localhost:8000');
            }
            posts = await fallbackData.json();
        } catch (fallbackError) {
            console.error('Ошибка при получении данных с localhost:8000:', fallbackError);
            // При ошибке на обоих серверах используем запасную ссылку
            posts.link = 'https://fallback-link.com';
        }
    }

    return (
        <div
            className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
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
            <h2>Динамический контент</h2>
            <LinksComponent link={posts.link}/>
        </div>
    );
}
