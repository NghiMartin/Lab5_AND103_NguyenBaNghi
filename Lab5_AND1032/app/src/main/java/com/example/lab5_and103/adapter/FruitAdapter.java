package com.example.lab5_and103.adapter;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;

import com.example.lab5_and103.R;
import com.example.lab5_and103.databinding.ItemFruitBinding;
import com.example.lab5_and103.model.Distributor;
import com.example.lab5_and103.model.Fruit;

import java.util.ArrayList;

public class FruitAdapter extends RecyclerView.Adapter<FruitAdapter.ViewHolder>{
    private Context context;
    private ArrayList<Fruit> list;
    private FruitClick fruitClick;

    public FruitAdapter(Context context, ArrayList<Fruit> list, FruitClick fruitClick) {
        this.context = context;
        this.list = list;
        this.fruitClick = fruitClick;
    }

    public interface FruitClick {
        void delete(Fruit fruit);
        void edit(Fruit fruit);

        void showDetail(Fruit fruit);
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ItemFruitBinding binding = ItemFruitBinding.inflate(LayoutInflater.from(parent.getContext()),parent,false);

        return new ViewHolder(binding);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        Fruit fruit = list.get(position);
        holder.binding.tvName.setText(fruit.getName());
        Distributor distributor = fruit.getDistributor();
        holder.binding.tvPriceQuantity.setText(distributor.getName());
        holder.binding.tvDes.setText(fruit.getPrice());
        if(!fruit.getImage().isEmpty()){
            String url  = fruit.getImage().get(0);
            String newUrl = url.replace("localhost", "10.0.2.2");
            Glide.with(context)
                    .load(newUrl)
                    .thumbnail(Glide.with(context).load(R.drawable.image_icon))
                    .into(holder.binding.img);
        }

        holder.binding.btnEdit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                fruitClick.edit(fruit);
            }
        });
        holder.binding.btnDelete.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                fruitClick.delete(fruit);
            }
        });

    }


    @Override
    public int getItemCount() {
        return list.size();
    }

    public class ViewHolder extends RecyclerView.ViewHolder {
        ItemFruitBinding binding;
        public ViewHolder(ItemFruitBinding binding) {
            super(binding.getRoot());
            this.binding = binding;
        }
    }
}
