import emailjs from "@emailjs/browser";

emailjs.init("Rhv039vD8v6jwRYZZ");

export const sendApprovalEmail = async (email: string, toolName: string, submitted_by: string) => {
  try {
    const serviceID = "service_r2lv60r";
    const templateID = "template_ig5nrn8";

    console.log("sendApprovalEmail - toolName:", toolName);
    console.log("sendApprovalEmail - recipient:", email);

    if (!email) {
      throw new Error("Recipient email is required");
    }

    const templateParams = {
      to_email: email,
      tool_name: toolName,
      submitter_name: submitted_by
    };

    const response = await emailjs.send(serviceID, templateID, templateParams);
    console.log("Email sent successfully:", response.status, response.text);
  } catch (error) {
    console.error("Failed to send email:", error);
  }
};
