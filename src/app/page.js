import DynamicContent from "@/app/components/DynamicContent";
import Image from "next/image";
import styles from './../page.module.css';

export default function Home() {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <header className={styles.header}>
                    <h1 className={styles.title}>
                        Статический контент, который кэшируется
                    </h1>
                    <p className={styles.subtitle}>
                        Пример PWA приложения с статическим и динамическим контентом
                    </p>
                </header>

                <main>
                    <section className={styles.section}>
                        <div className={styles.imageContainer}>
                            <Image
                                src="https://plus.unsplash.com/premium_photo-1719943510748-4b4354fbcf56?q=80&w=2670&auto=format&fit=crop"
                                alt="Горное озеро с отражением облаков"
                                fill
                                style={{ objectFit: 'cover' }}
                                priority
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        </div>
                        <div className={styles.sectionContent}>
                            <h2 className={styles.sectionTitle}>
                                О нашем приложении
                            </h2>
                            <p className={styles.sectionText}>
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto atque deleniti id rem saepe?
                                Delectus, ducimus earum, enim exercitationem facilis illum iure magni molestiae provident quidem
                                quos tempore unde voluptatibus.
                            </p>
                            <p className={styles.sectionText}>
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto atque deleniti id rem saepe?
                                Delectus, ducimus earum, enim exercitationem facilis illum iure magni molestiae provident quidem
                                quos tempore unde voluptatibus.
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto atque deleniti id rem saepe?
                                Delectus, ducimus earum, enim exercitationem facilis illum iure magni molestiae provident quidem
                                quos tempore unde voluptatibus.
                            </p>
                        </div>
                    </section>

                    <section className={styles.section}>
                        <div className={styles.sectionContent}>
                            <h2 className={styles.sectionTitle}>
                                Динамический контент
                            </h2>
                            <DynamicContent />
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}

