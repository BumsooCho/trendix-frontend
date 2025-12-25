import { HeaderItem } from '@/types/menu'
import { CourseType } from '@/types/course'
import { Hourtype } from '@/types/hour'
import { CourseDetailType } from '@/types/coursedetail'
import { MentorType } from '@/types/mentor'
import { TestimonialType } from '@/types/testimonial'
import { FooterLinkType } from '@/types/footerlinks'

export const HeaderData: HeaderItem[] = [
  { label: '홈', href: '/' },
  { label: '대시보드', href: '/dashboard' },
  { label: '급등 영상', href: '/#trending-section' },
  { label: '내 채널 분석', href: '/channel' },
  { label: '영상 비교', href: '/compare' },
]

export const CourseData: CourseType[] = [
  { name: 'Mobile Development' },
  { name: 'Web Development' },
  { name: 'Data Science' },
  { name: 'Cloud Computing' },
]

export const HourData: Hourtype[] = [
  { name: '20hrs in a Month' },
  { name: '30hrs in a Month' },
  { name: '40hrs in a Month' },
  { name: '50hrs in a Month' },
]

export const Companiesdata: { imgSrc: string }[] = [
  {
    imgSrc: '/images/team/bear.png',
  },
  {
    imgSrc: '/images/team/cat.png',
  },
  {
    imgSrc: '/images/team/dog.png',
  },
]

export const CourseDetailData: CourseDetailType[] = [
  {
    course: 'HTML, CSS, JS',
    imageSrc: '/images/courses/coursesOne.svg',
    profession: 'HTML, CSS, Javascript Development',
    price: '40',
    category: 'webdevelopment',
  },
  {
    course: 'Node.js',
    imageSrc: '/images/courses/coursesTwo.svg',
    profession: 'Backend with Node.js and Express.js',
    price: '21',
    category: 'webdevelopment',
  },
  {
    course: 'Database',
    imageSrc: '/images/courses/coursesThree.svg',
    profession: 'Learn Mongodb with Mongoose',
    price: '21',
    category: 'webdevelopment',
  },
  {
    course: 'React.js',
    imageSrc: '/images/courses/coursesFour.svg',
    profession: 'Learn React with Redux toolkit',
    price: '99',
    category: 'webdevelopment',
  },
  {
    course: 'React Native',
    imageSrc: '/images/courses/coursesOne.svg',
    profession: 'Learn React Native with Node.js',
    price: '89',
    category: 'mobiledevelopment',
  },
  {
    course: 'Swift',
    imageSrc: '/images/courses/coursesThree.svg',
    profession: 'Learn Swift from Scratch',
    price: '89',
    category: 'mobiledevelopment',
  },
  {
    course: 'Flutter',
    imageSrc: '/images/courses/coursesFour.svg',
    profession: 'Flutter App Development',
    price: '69',
    category: 'mobiledevelopment',
  },
  {
    course: 'Onsen UI',
    imageSrc: '/images/courses/coursesTwo.svg',
    profession: 'Learn Onsen Ui with HTML, CSS',
    price: '69',
    category: 'mobiledevelopment',
  },
  {
    course: 'TensorFlow',
    imageSrc: '/images/courses/coursesTwo.svg',
    profession: 'Learn TensorFlow with SQL',
    price: '99',
    category: 'datascience',
  },
  {
    course: 'AWS',
    imageSrc: '/images/courses/coursesFour.svg',
    profession: 'AWS Deep Learning AMI',
    price: '99',
    category: 'datascience',
  },
  {
    course: 'Bokeh',
    imageSrc: '/images/courses/coursesOne.svg',
    profession: 'Learn Bokeh with Python',
    price: '99',
    category: 'datascience',
  },
  {
    course: 'Scikit',
    imageSrc: '/images/courses/coursesThree.svg',
    profession: 'Scikit with Python Development',
    price: '89',
    category: 'datascience',
  },
  {
    course: 'Laas',
    imageSrc: '/images/courses/coursesThree.svg',
    profession: 'Infra-as-a-Service',
    price: '21',
    category: 'cloudcomputing',
  },
  {
    course: 'Iaas',
    imageSrc: '/images/courses/coursesFour.svg',
    profession: 'Info-as-a-Service',
    price: '29',
    category: 'cloudcomputing',
  },
  {
    course: 'Paas',
    imageSrc: '/images/courses/coursesOne.svg',
    profession: 'Platform-as-a-Service',
    price: '99',
    category: 'cloudcomputing',
  },
  {
    course: 'Saas',
    imageSrc: '/images/courses/coursesTwo.svg',
    profession: 'Software-as-a-Service',
    price: '58',
    category: 'cloudcomputing',
  },
]

export const MentorData: MentorType[] = [
  {
    name: 'Senior UX Designer',
    href: '#',
    imageSrc: '/images/mentor/boy1.svg',
    imageAlt: "Front of men's Basic Tee in black.",
    color: 'Shoo Thar Mein',
  },
  {
    name: 'Photoshop Instructor',
    href: '#',
    imageSrc: '/images/mentor/boy2.svg',
    imageAlt: "Front of men's Basic Tee in black.",
    color: 'Cristian Doru Barin',
  },
  {
    name: 'SEO Expert',
    href: '#',
    imageSrc: '/images/mentor/boy3.svg',
    imageAlt: "Front of men's Basic Tee in black.",
    color: 'Tanzeel Ur Rehman',
  },
  {
    name: 'UI/UX Designer',
    href: '#',
    imageSrc: '/images/mentor/boy4.svg',
    imageAlt: "Front of men's Basic Tee in black.",
    color: 'Andrew Williams',
  },
  {
    name: 'Web Development / Web Design',
    href: '#',
    imageSrc: '/images/mentor/boy5.svg',
    imageAlt: "Front of men's Basic Tee in black.",
    color: 'Brad Schiff',
  },
  {
    name: 'Adobe Certified Instructor',
    href: '#',
    imageSrc: '/images/mentor/girl1.svg',
    imageAlt: "Front of men's Basic Tee in black.",
    color: 'Daniel Walter Scott',
  },
]

export const TestimonialData: TestimonialType[] = [
  {
    profession: 'UX/UI Designer',
    name: 'Andrew Williams',
    imgSrc: '/images/testimonial/user-1.jpg',
    starimg: '/images/testimonial/stars.png',
    detail:
      "I have been a Junior Graphic Designer for more then 10 years. Some things are problem that I had and teach how to solve them. That's why this course is so great!",
  },
  {
    profession: 'UX/UI Designer',
    name: 'Cristian Doru Barin',
    imgSrc: '/images/testimonial/user-2.jpg',
    starimg: '/images/testimonial/stars.png',
    detail:
      "I have been a Junior Graphic Designer for more then 10 years. Some things are problem that I had and teach how to solve them. That's why this course is so great!",
  },
  {
    profession: 'UX/UI Designer',
    name: 'Tanzeel Ur Rehman',
    imgSrc: '/images/testimonial/user-3.jpg',
    starimg: '/images/testimonial/stars.png',
    detail:
      "I have been a Junior Graphic Designer for more then 10 years. Some things are problem that I had and teach how to solve them. That's why this course is so great!",
  },
  {
    profession: 'UX/UI Designer',
    name: 'Andrew Williams',
    imgSrc: '/images/testimonial/user-1.jpg',
    starimg: '/images/testimonial/stars.png',
    detail:
      "I have been a Junior Graphic Designer for more then 10 years. Some things are problem that I had and teach how to solve them. That's why this course is so great!",
  },
]

export const FooterLinkData: FooterLinkType[] = [
  {
    section: '서비스',
    links: [
      { label: '홈', href: '/' },
      { label: '급등 영상', href: '/#trending-section' },
      { label: '내 채널 분석', href: '/channel' },
      { label: '영상 비교', href: '/compare' },
    ],
  },
  {
    section: 'Support',
    links: [
      { label: 'Help center', href: '/' },
      { label: 'Terms of service', href: '/' },
      { label: 'Legal', href: '/' },
      { label: 'Privacy Policy', href: '/' },
      { label: 'Status', href: '/' },
    ],
  },
]
