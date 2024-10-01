package com.ict.backend.util;
import java.util.UUID;

public class UUIDUtils {
    public static String createType4UUID(){
        UUID uuid4 = UUID.randomUUID();
        return uuid4.toString();
    }
}
