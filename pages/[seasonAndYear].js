/* eslint-disable react/jsx-key */
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import callGraphql from './api/callGraphql';
import styles from '../styles/Chart.module.css';

export default function Chart({ Page, season, year }) {

    React.useEffect(function () {
        let seasons = ['.winter', '.spring', '.summer', '.fall'];
        seasons.forEach(function (s) {
            document.querySelector(s).classList.remove('active');
        });
        document.querySelector(`.${season.toLowerCase()}`).classList.add('active');

        if (Page.media.length != 0) {
            let media = Page.media[0];
            if (media.coverImage.extraLarge.includes('default.jpg')) { return }
            document.querySelector('.bannerImage').style.backgroundImage = `url(${media.bannerImage || media.coverImage.extraLarge})`;
        };
    });

    return (<>
        <div className={styles.navWrap}>
            <div className={`${styles.navImage} bannerImage`}>
            </div>
            <div className={styles.navBarWrap}>
                <div className={styles.navBar}>
                    <div className={styles.navIconWrap}>
                        <Link href='/'>
                            <a><Image className={styles.navIcon} alt=''
                                src='/rimuru.png'
                                height={40} width={40}
                            /></a>
                        </Link>
                        <Link href='https://github.com/AbsolumFrAG/hanichart'>
                            <a target='blank' className={`${styles.navLink}`}>haniChart</a>
                        </Link>
                    </div>
                    <Link href={`/Winter-${year}`}>
                        <a className={`${styles.navLink} winter`}>Hiver {year}</a>
                    </Link>
                    <Link href={`/Spring-${year}`}>
                        <a className={`${styles.navLink} spring`}>Printemps {year}</a>
                    </Link>
                    <Link href={`/Summer-${year}`}>
                        <a className={`${styles.navLink} summer`}>Été {year}</a>
                    </Link>
                    <Link href={`/Fall-${year}`}>
                        <a className={`${styles.navLink} fall`}>Automne {year}</a>
                    </Link>
                </div>
            </div>
        </div>
        <div className={`${styles.chartWrap} ${styles.mainContent}`}>
            {Page.media.length != 0 ? (<>
                {Page.media.map(function (entry) {
                    return (
                        <div className={styles.entryCard}>
                            <div className={styles.coverWrap}>
                                <Image className={styles.cover} alt='' src={entry.coverImage.extraLarge} height={245} width={165} />
                                <div className={styles.title}>
                                    <Link className={styles.titleLink} href={entry.siteUrl}>
                                        <a target='blank'>{entry.title.english || entry.title.romaji}</a>
                                    </Link>
                                    <div className={styles.studios}>
                                        {entry.studios.nodes[0] &&
                                            <Link href={entry.studios.nodes[0].siteUrl}>
                                                <a target='blank'>{entry.studios.nodes[0].name}</a>
                                            </Link>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className={styles.cardBody}>
                                <div className={styles.air}>
                                    <div className={styles.airSchedule}>
                                        {entry.airingSchedule.nodes.length != 0 ? (<>
                                            <div className={styles.airType}>Épisode {airingUntilOrAgo(entry.airingSchedule.nodes, true)}</div>
                                            <div className={styles.airTime}>{timeUntilAiring(entry.airingSchedule.nodes, true)}</div>
                                        </>) : entry.episodes && entry.endDate ? (<>
                                            <div className={styles.airType}>Épisode {entry.episodes} sortie le</div>
                                            <div className={styles.airTime}>{airedOn(entry.endDate)}</div>
                                        </>) : entry.alreadyAired.nodes.length != 0 ? (<>
                                            <div className={styles.airType}>Épisode {airingUntilOrAgo(entry.alreadyAired.nodes, false)}</div>
                                            <div className={styles.airTime}>{timeUntilAiring(entry.alreadyAired.nodes, false)}</div>
                                        </>) : (<>
                                            <div className={styles.airType}>Épisode 1 sortie le</div>
                                            <div className={styles.airTime}>{airedOn(entry.startDate)}</div>
                                        </>)}
                                    </div>
                                    <div className={styles.streamWrap}>
                                        <Image className={styles.thumbnail} alt='' src={entry.bannerImage || entry.coverImage.extraLarge} height={50} width={90} />
                                        <Link href={`https://hentaihaven.com/?s=${encodeURIComponent(entry.title.english || entry.title.romaji)}`}>
                                            <a target='blank' className={styles.play}>regarder ▶</a>
                                        </Link>
                                    </div>
                                </div>
                                <div className={styles.stats}>
                                    <div className={styles.popularity}>{entry.popularity || 0} <span className={styles.statIcons}>add</span></div>
                                    <div className={styles.meanScore}>{entry.meanScore || 0} <span className={styles.statIcons}>star</span></div>
                                    <div className={styles.favourites}>{entry.favourites || 0} <span className={styles.statIcons}>favorite</span></div>
                                </div>
                                <div className={styles.descriptionWrap}>
                                    {(entry.description || 'No Data. ¯\\_(ツ)_/¯').replace(/<(.*)>/ig, '')}
                                </div>
                                <div className={styles.genresWrap}>
                                    {entry.genres.slice(0, 3).map(function (genre) {
                                        return (<div className={styles.genres}>{genre}</div>)
                                    })}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </>) : (<></>)}
        </div>
    </>)

}

export async function getServerSideProps({ params }) {
    let seasonAndYear = params.seasonAndYear.split('-'),
        season = seasonAndYear.shift().toUpperCase(),
        year = seasonAndYear.pop();

    let { Page } = await callGraphql('query($season:MediaSeason,$year:Int){Page{media(season:$season,seasonYear:$year,isAdult:true,sort:FAVOURITES_DESC){title{english,romaji},siteUrl,coverImage{extraLarge},bannerImage,description(asHtml:false),genres,airingSchedule(notYetAired:true){nodes{timeUntilAiring,airingAt,episode}},alreadyAired:airingSchedule(notYetAired:false){nodes{timeUntilAiring,airingAt,episode}},episodes,startDate{year,month,day},endDate{year,month,day},studios(isMain:true){nodes{name,siteUrl}},meanScore,popularity,favourites}}}', { season: season, year: year });
    return { props: { Page, season, year } };
}


function airedOn(on) {
    let months = ['', 'Jan ', 'Feb ', 'Mar ', 'Apr ', 'May ', 'Jun ', 'July ', 'Aug ', 'Sep ', 'Oct ', 'Nov ', 'Dec '];
    let onDay;
    if (on.day) {
        onDay = `${on.day}, `;
    }
    return `${months[on.month || 0]}${onDay || ''}${on.year || ''}`;
}

function airingUntilOrAgo(airingSchedule, notYetAired) {

    let airing;
    if (notYetAired) {
        airing = airingSchedule[0]
    }
    else {
        airing = airingSchedule.at(-1)
    }
    if (airing.timeUntilAiring > 0) {
        return `${airing.episode} sort dans`;
    }
    return `${airing.episode} est sortie`;

}

function timeUntilAiring(airingSchedule, notYetAired) {

    let seconds;
    if (notYetAired) {
        seconds = airingSchedule[0].timeUntilAiring;
    }
    else {
        seconds = airingSchedule.at(-1).timeUntilAiring;
    }

    if (seconds < 0) {
        seconds = Math.abs(seconds);
        let timeSince;
        timeSince = Math.floor(seconds / 2592000);
        if (timeSince == 1) {
            return timeSince + ' mois avant';
        }
        else if (timeSince >= 2) {
            return timeSince + ' mois avant';
        }
        timeSince = Math.floor(seconds / 604800);
        if (timeSince == 1) {
            return timeSince + ' semaine avant';
        }
        else if (timeSince >= 2) {
            return timeSince + ' semaines avant';
        }
        timeSince = Math.floor(seconds / 86400);
        if (timeSince == 1) {
            return timeSince + ' jour avant';
        }
        else if (timeSince >= 2) {
            return timeSince + ' jours avant';
        }
        timeSince = Math.floor(seconds / 3600);
        if (timeSince == 1) {
            return timeSince + ' heure avant';
        }
        else if (timeSince >= 2) {
            return timeSince + ' heures avant';
        }
        timeSince = Math.floor(seconds / 60);
        if (timeSince == 1) {
            return timeSince + ' min avant';
        }
        else if (timeSince >= 2) {
            return timeSince + ' mins avant';
        }
        return Math.floor(seconds) + ' secs avant';
    }

    let secInWeek = 604800,
        secInDay = 86400,
        secInHour = 3600,
        secInMinute = 60;

    let w = Math.floor(seconds / secInWeek),
        d = Math.floor((seconds - w * secInWeek) / secInDay),
        h = Math.floor((seconds - w * secInWeek - d * secInDay) / secInHour),
        m = Math.floor((seconds - w * secInWeek - d * secInDay - h * secInHour) / secInMinute),
        s = seconds - w * secInWeek - d * secInDay - h * secInHour - m * secInMinute;

    let wDisplay = w > 0 ? w + (w == 1 ? ' semaine, ' : ' semaines, ') : '',
        dDisplay = d > 0 ? d + (d == 1 ? ' jour, ' : ' jours, ') : '',
        hDisplay = h > 0 ? h + (h == 1 ? ' heure, ' : ' heures, ') : '',
        mDisplay = m > 0 ? m + (m == 1 ? ' min, ' : ' mins, ') : '',
        sDisplay = s > 0 ? s + (s == 1 ? ' sec' : ' secs') : '';

    let airedAt = wDisplay + dDisplay + hDisplay + mDisplay + sDisplay;
    return airedAt.split(',', 2).join(',');
}