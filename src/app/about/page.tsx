import Link from "next/link";
import {
    ShieldCheck,
    Clock3,
    Wrench,
    CreditCard,
    Users,
    Star,
    ArrowRight,
} from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";


export const features = [
    {
        icon: ShieldCheck,
        title: "Verified Technicians",
        description:
            "All professionals are verified to ensure quality and trust.",
    },
    {
        icon: Clock3,
        title: "Fast Response",
        description:
            "Book a service anytime and get quick responses from technicians.",
    },
    {
        icon: Wrench,
        title: "Professional Services",
        description:
            "From plumbing to electrical work, we've got you covered.",
    },
    {
        icon: CreditCard,
        title: "Secure Payment",
        description:
            "Pay safely through trusted online payment methods.",
    },
];

const stats = [
    {
        value: "5K+",
        label: "Happy Customers",
    },
    {
        value: "250+",
        label: "Verified Technicians",
    },
    {
        value: "25+",
        label: "Service Categories",
    },
    {
        value: "98%",
        label: "Customer Satisfaction",
    },
];

export default function AboutPage() {
    return (
        <>
        <Navbar />
        <main className="bg-slate-50">
            

            {/* Hero */}
            <section className="bg-gradient-to-r from-gray-500 to-indigo-300 py-24 text-white">
                <div className="mx-auto max-w-7xl px-4 text-center">

                    <h1 className="text-5xl font-extrabold">
                        About FixItNow
                    </h1>

                    <p className="mx-auto mt-6 max-w-3xl text-lg text-blue-100">
                        FixItNow is a trusted home service platform that connects
                        customers with experienced technicians for electrical,
                        plumbing, AC repair, cleaning and many more services.
                    </p>

                    <Link
                        href="/login"
                        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-blue-700 transition hover:bg-blue-100"
                    >
                        Explore Services
                        <ArrowRight size={18} />
                    </Link>

                </div>
            </section>

            {/* Statistics */}
            <section className="mx-auto max-w-7xl px-4 py-20">

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

                    {stats.map((item) => (
                        <div
                            key={item.label}
                            className="rounded-2xl bg-white p-8 text-center shadow-md"
                        >
                            <h2 className="text-4xl font-bold text-blue-600">
                                {item.value}
                            </h2>

                            <p className="mt-2 text-gray-600">
                                {item.label}
                            </p>
                        </div>
                    ))}

                </div>

            </section>

            {/* Mission */}
            <section className="mx-auto max-w-7xl px-4 py-10 ">

                <div className="grid gap-10 lg:grid-cols-2 ">

                    <div className="rounded-2xl bg-blue-400 py-20 text-white p-8 shadow-md ">

                        <h2 className="mb-5 text-3xl font-bold">
                            Our Mission
                        </h2>

                        <p className="leading-8 text-white-600">
                            Our mission is to make home services simple,
                            reliable and accessible for everyone by connecting
                            customers with trusted technicians through one
                            easy-to-use platform.
                        </p>

                    </div>

                    <div className="rounded-2xl bg-blue-400 py-20 text-white p-8 shadow-md">

                        <h2 className="mb-5 text-3xl font-bold ">
                            Our Vision
                        </h2>

                        <p className="leading-8 text-white-600">
                            We aim to become the leading home service platform
                            by providing secure bookings, skilled professionals,
                            transparent pricing and excellent customer support.
                        </p>

                    </div>

                </div>

            </section>

            {/* Why Choose Us */}
            <section className="mx-auto max-w-7xl px-4 py-20">

                <div className="mb-12 text-center text-blue-500">

                    <h2 className="text-4xl font-bold text-blue-500">
                        Why Choose FixItNow?
                    </h2>

                    <p className="mt-4 text-gray-600">
                        We make home maintenance easy, fast and reliable.
                    </p>

                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">

                    {features.map((feature) => {
                        const Icon = feature.icon;

                        return (
                            <div
                                key={feature.title}
                                className="rounded-2xl bg-white p-8 shadow-md transition hover:-translate-y-2 hover:shadow-xl"
                            >
                                <Icon
                                    className="mb-5 text-blue-400"
                                    size={42}
                                />

                                <h3 className="mb-3 text-xl font-bold text-blue-400">
                                    {feature.title}
                                </h3>

                                <p className="text-gray-600">
                                    {feature.description}
                                </p>

                            </div>
                        );
                    })}

                </div>

            </section>

            {/* Process */}
            <section className="bg-white py-20">

                <div className="mx-auto max-w-7xl px-4 text-blue-400">

                    <h2 className="mb-12 text-center text-4xl font-bold ">
                        How It Works
                    </h2>

                    <div className="grid gap-8 md:grid-cols-4">

                        {[
                            "Book a Service",
                            "Choose Technician",
                            "Get Service",
                            "Pay Securely",
                        ].map((step, index) => (
                            <div
                                key={step}
                                className="rounded-xl border bg-slate-50 p-8 text-center"
                            >
                                <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
                                    {index + 1}
                                </div>

                                <h3 className="font-semibold">
                                    {step}
                                </h3>

                            </div>
                        ))}

                    </div>

                </div>

            </section>

            {/* CTA */}
            <section className="bg-gray-800 py-20 text-white">

                <div className="mx-auto max-w-4xl px-4 text-center">

                    <Users
                        size={48}
                        className="mx-auto mb-5"
                    />

                    <h2 className="text-4xl font-bold">
                        Ready to Book a Service?
                    </h2>

                    <p className="mx-auto mt-5 max-w-2xl text-blue-100">
                        Join thousands of satisfied customers and experience
                        trusted home services with FixItNow.
                    </p>

                    <Link
                        href="/login"
                        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-blue-400 transition hover:bg-blue-100"
                    >
                        Browse Services
                        <Star size={18} />
                    </Link>

                </div>

            </section>
           

        </main>
          <Footer />
          </>
    );
}