import Card from '../components/atoms/Card';
import Icon from '../components/atoms/Icon';
import Button from '../components/atoms/Button';

export default function ContactUsPage() {
    return (
        <div className="flex flex-col gap-8 max-w-5xl">

            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold dark:text-white">Contact Us</h1>
                <p className="text-gray-500">
                    Reach out to us for support, feedback, or suggestions.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Contact Info */}
                <Card>
                    <h3 className="text-lg font-bold mb-4 dark:text-white">
                        Get in Touch
                    </h3>

                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 text-green-700 rounded-lg dark:bg-green-900/30">
                                <Icon name="mail" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-semibold dark:text-white">
                                    support@ecoscore.com
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 text-blue-700 rounded-lg dark:bg-blue-900/30">
                                <Icon name="call" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Phone</p>
                                <p className="font-semibold dark:text-white">
                                    +91 98765 43210
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-100 text-orange-700 rounded-lg dark:bg-orange-900/30">
                                <Icon name="location_on" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Office</p>
                                <p className="font-semibold dark:text-white">
                                    New Delhi, India
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Contact Form */}
                <Card>
                    <h3 className="text-lg font-bold mb-4 dark:text-white">
                        Send a Message
                    </h3>

                    <form className="flex flex-col gap-4">
                        <input
                            type="text"
                            placeholder="Your Name"
                            className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 outline-none"
                        />
                        <input
                            type="email"
                            placeholder="Your Email"
                            className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 outline-none"
                        />
                        <textarea
                            rows="4"
                            placeholder="Your Message"
                            className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 outline-none"
                        />
                        <Button variant="primary">
                            Send Message
                        </Button>
                    </form>
                </Card>

            </div>
        </div>
    );
}

