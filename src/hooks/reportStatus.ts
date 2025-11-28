import emailjs from "@emailjs/browser";

// Initialize EmailJS once in your app (somewhere central)
emailjs.init("Rhv039vD8v6jwRYZZ");

export const sendReportNotificationEmail = async (
    email: string,
    toolName: string,
    reporterName: string,
    status: "approved" | "rejected"
) => {
    try {
        const serviceID = "service_r2lv60r";
        const templateID = "template_jfnlvhk";


        if (!email) throw new Error("Recipient email is required");

        const templateParams = {
            to_email: email,
            tool_name: toolName,
            reporter_name: reporterName,
            status: status,
        };
        console.log("Template params", templateParams);

        const response = await emailjs.send(serviceID, templateID, templateParams);

        console.log("Email sent successfully:", response.status, response.text);
    } catch (error) {
        console.error("Failed to send report notification email:", error);
    }
};
