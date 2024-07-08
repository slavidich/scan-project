import React from "react";
import "../styles/mainTarifs.scss"
import {SvgTarif1, SvgTarif2, SvgTarif3} from "../img/slick-svg.jsx"
import Ok1 from "../img/ok1.png"

function MainTarifs(){
    return(<>
        <p className=" main__tarifs__beforetext main__whyus">Наши тарифы</p>
        <div className="main__tarifs">
            <div className="main__tarifs__tarif tarif1">
                <div className="main__tarifs__tarif__header tarif1__header">
                    <div>
                        <h3>Beginner</h3>
                        <p>Для небольшого исследования</p>
                    </div>
                    <SvgTarif1></SvgTarif1>
                </div>
                <div className="main__tarifs__tarif__div tarif1__div">
                    <div className="main__tarifs__tarif__div__current">
                        <div>
                            <p>Текущий тариф</p>
                        </div>
                    </div>
                    <div className="main__tarifs__tarif__div__prices">
                        <p>799 ₽</p>
                        <p>1 200 ₽</p>
                    </div>
                    <p>или 150 ₽/мес. при рассрочке на 24 мес.</p>
                    <div className="main__tarifs__tarif__div__includes">
                        <p>В тариф входит:</p>
                        <div>
                            <img src={Ok1} alt='ok'></img>
                            <p>Безлимитная история запросов</p>
                        </div>
                        <div>
                            <img src={Ok1} alt='ok'></img>
                            <p>Безопасная сделка</p>
                        </div>
                        <div>
                            <img src={Ok1} alt='ok'></img>
                            <p>Поддержка 24/7</p>
                        </div>
                    </div>
                    <div className="main__tarifs__tarif__div__button">
                        <a href="#">Перейти в личный кабинет</a>
                    </div>
                </div>
                
                
            </div>
            <div className="main__tarifs__tarif tarif2">
                <div className="main__tarifs__tarif__header tarif2__header">
                    <div>
                        <h3>Pro</h3>
                        <p>Для HR и фрилансеров</p>
                    </div>
                    <SvgTarif2></SvgTarif2>
                </div>
                <div className="main__tarifs__tarif__div tarif2__div">
                    <div className="main__tarifs__tarif__div__current">
                        
                    </div>
                    <div className="main__tarifs__tarif__div__prices">
                        <p>1 299 ₽</p>
                        <p>2 600 ₽</p>
                    </div>
                    <p>или 279 ₽/мес. при рассрочке на 24 мес.</p>
                    <div className="main__tarifs__tarif__div__includes">
                        <p>В тариф входит:</p>
                        <div>
                            <img src={Ok1} alt='ok'></img>
                            <p>Все пункты тарифа Beginner</p>
                        </div>
                        <div>
                            <img src={Ok1} alt='ok'></img>
                            <p>Экспорт истории</p>
                        </div>
                        <div>
                            <img src={Ok1} alt='ok'></img>
                            <p>Рекомендации по приоритетам</p>
                        </div>
                    </div>
                    <div className="main__tarifs__tarif__div__button">
                        <a href="#">Подробнее</a>
                    </div>
                </div>
                

            </div>
            <div className="main__tarifs__tarif tarif3">
                <div className="main__tarifs__tarif__header tarif3__header">
                    <div>
                        <h3>Business</h3>
                        <p>Для корпоративных клиентов</p>
                    </div>
                    
                    <SvgTarif3></SvgTarif3>
                </div>
                <div className="main__tarifs__tarif__div tarif3__div">
                    <div className="main__tarifs__tarif__div__current">
                        
                    </div>
                    <div className="main__tarifs__tarif__div__prices">
                        <p>2 379 ₽</p>
                        <p>3 700 ₽</p>
                    </div>
                    <div className="main__tarifs__tarif__div__includes">
                        <p>В тариф входит:</p>
                        <div>
                            <img src={Ok1} alt='ok'></img>
                            <p>Все пункты тарифа Pro</p>
                        </div>
                        <div>
                            <img src={Ok1} alt='ok'></img>
                            <p>Безлимитное количество запросов</p>
                        </div>
                        <div>
                            <img src={Ok1} alt='ok'></img>
                            <p>Приоритетная поддержка</p>
                        </div>
                    </div>
                    <div className="main__tarifs__tarif__div__button">
                        <a href="#">Подробнее</a>
                    </div>
                </div>
                
            </div>
        </div>
    </>
    )
}
export default MainTarifs