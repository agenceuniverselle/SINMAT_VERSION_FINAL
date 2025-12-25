"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";

import TopBar from "@/components/Nav/TopBar";
import Header from "@/components/Nav/Header";
import Navigation from "@/components/Nav/Navigation";
import Footer from "@/components/Footer/Footer";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { MapPin, Phone, Mail } from "lucide-react";
import { toast } from "sonner";

/* ✅ API centralisée */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ContactUs = () => {
  const { t } = useTranslation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.toLowerCase().endsWith("@gmail.com")) {
      toast.error(t("contact.form.invalidEmail"));
      return;
    }

    try {
const res = await fetch(`${API_BASE_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
          phone,
        }),
      });

      if (!res.ok) throw new Error("Erreur lors de l’envoi");

      toast.success(t("contact.form.success"));

      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setPhone("");
    } catch (err) {
      console.error(err);
      toast.error(t("contact.form.error"));
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <Header />
      <Navigation />

      {/* HERO */}
      <div className="relative h-64 bg-gradient-to-r from-navy to-navy/80 flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1200')] bg-cover bg-center opacity-20" />
        <div className="relative z-10 text-center text-white">
          <h1 className="text-5xl text-black font-bold mb-2">
            {t("contact.title")}
          </h1>
          <p className="text-lg text-black">
            <a href="/" className="hover:text-primary transition-colors">
              {t("contact.breadcrumb.home")}
            </a>
            <span className="mx-1 text-black">/</span>
            <span className="text-black">
              {t("contact.breadcrumb.contact")}
            </span>
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* INFOS */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-foreground">
                {t("contact.contactTitle")}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("contact.contactText")}
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">
                    {t("contact.addressTitle")}
                  </h3>
                  <p className="text-muted-foreground">
                    {t("contact.address")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">
                    {t("contact.phoneTitle")}
                  </h3>
                  <p
                    className="text-muted-foreground"
                    dir="ltr"
                    style={{ unicodeBidi: "bidi-override" }}
                  >
                    +212 666565325
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">
                    {t("contact.emailTitle")}
                  </h3>
                  <p className="text-muted-foreground">
                    contact@sinmat.ma
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FORM */}
          <div className="bg-muted/30 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-6">
              {t("contact.form.title")}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>
                  {t("contact.form.name")}{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <Label>
                  {t("contact.form.phone")}{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div>
                <Label>{t("contact.form.email")}</Label>
                <Input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <Label>{t("contact.form.subject")}</Label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div>
                <Label>
                  {t("contact.form.message")}{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  required
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <Button className="w-full">
                {t("contact.form.send")}
              </Button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ContactUs;
