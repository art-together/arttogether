package com.pm.eggs.utils;


import com.sendgrid.SendGrid;
import com.sendgrid.SendGridException;

public class Mail {

    private static final String USERNAME = "app50072608@heroku.com";
    private static final String PASSWORD = "ATbest2016";

    public void sendMail(String recipient, String subject, String body) {
        SendGrid sendgrid = new SendGrid(USERNAME, PASSWORD);

        SendGrid.Email email = new SendGrid.Email();
        email.addTo(recipient);
        email.setFrom(USERNAME);
        email.setSubject(subject);
        email.setText(body);

        try {
            SendGrid.Response response = sendgrid.send(email);
            //System.out.println("done " + response.getMessage());
        } catch (SendGridException e) {
            System.out.println(e);
        }
    }
}
