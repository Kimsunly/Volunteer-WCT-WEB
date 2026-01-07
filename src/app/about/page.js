import MissionArea from './components/MissionArea';
import OurStory from './components/OurStory';
import Timeline from './components/Timeline';
import Achievements from './components/Achievements';
import TeamCarousel from './components/TeamCarousel';
import Collaboration from './components/Collaboration';

export const metadata = {
    title: 'អំពីយើង',
    description: 'ស្វាគមន៍ទៅក្នុងទំព័រអំពីយើង',
};

export default function AboutPage() {
    return (
        <main className="flex-grow-1 mt-5">
            <MissionArea />
            <OurStory />
            <Timeline />
            <Achievements />
            <TeamCarousel />
            <Collaboration />
        </main>
    );
}